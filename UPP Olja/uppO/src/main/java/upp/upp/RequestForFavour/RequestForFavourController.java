package upp.upp.RequestForFavour;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

import javax.servlet.http.HttpSession;

import org.activiti.engine.RuntimeService;
import org.activiti.engine.TaskService;
import org.activiti.engine.task.Task;
import org.mockito.Mock;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import upp.upp.jobCategory.JobCategory;
import upp.upp.jobCategory.JobCategoryService;
import upp.upp.task.MockTask;
import upp.upp.user.User;

@RestController
@RequestMapping("/requestForFavour")
public class RequestForFavourController {

	@Autowired
	private RuntimeService runtimeService;
	
	@Autowired
	private TaskService taskService;
	
	@Autowired
	private RequestForFavourService requestForFavourService;
	
	@Autowired
	private JobCategoryService jobCategoryService;
	
	@PostMapping
	public Long add(@RequestBody RequestForFavourDTO obj) {
		ServletRequestAttributes attr = (ServletRequestAttributes)RequestContextHolder.currentRequestAttributes();
		HttpSession session= attr.getRequest().getSession(true);
		User u = (User) session.getAttribute("korisnik");
		
		JobCategory jobCategory = jobCategoryService.findOne(obj.getJobCategoryID());
		RequestForFavour retVal = new RequestForFavour(obj, jobCategory, u );
		
		HashMap<String, Object> variables=new HashMap<>();
		List<User> lista = new ArrayList<>();
		retVal = requestForFavourService.save(retVal);
		variables.put("userKey",u.getRandomKey());
		variables.put("request",  retVal);
		variables.put("lista", lista );
		runtimeService.startProcessInstanceByKey("projekat",variables);
		Task t= taskService.createTaskQuery().active().taskAssignee(u.getRandomKey()).list().get(0);
		taskService.complete(t.getId(),variables);
		
		
		RequestForFavour temp = (RequestForFavour) variables.get("request");
		
		return temp.getId(); //ovdje se vraca na front za dodavanje request -a 
	}
	
	


/*Prihvatanje u prvom odabiru*/
	@PostMapping("/confirmNotEnoughCompanies")
	public void confirmForward(@RequestBody MockTask mockTask) {
		System.out.println("confirmNotEnoughCompanies");
		
		HashMap<String, Object> variables=new HashMap<>();
		Task task = taskService.createTaskQuery().active().taskId(mockTask.getId()).list().get(0);
		variables =(HashMap<String, Object>) runtimeService.getVariables(task.getProcessInstanceId());
		
		variables.put("decision",1);
		taskService.complete(task.getId(),variables);
	}	
	
/*Odbijanje u prvom odabiru*/	
	@PostMapping("/rejectNotEnoughCompanies")
	public void rejectForward(@RequestBody MockTask mockTask) {
		HashMap<String, Object> variables=new HashMap<>();
		Task task = taskService.createTaskQuery().active().taskId(mockTask.getId()).list().get(0);
		variables =(HashMap<String, Object>) runtimeService.getVariables(task.getProcessInstanceId());
		
		variables.put("decision",0);
		taskService.complete(task.getId(),variables);
		
	}	
}
