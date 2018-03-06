package upp.upp.task;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

import javax.servlet.http.HttpSession;

import org.activiti.engine.RuntimeService;
import org.activiti.engine.TaskService;
import org.activiti.engine.task.Task;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import upp.upp.RequestForFavour.RequestForFavour;
import upp.upp.RequestForFavour.RequestForFavourService;
import upp.upp.jobCategory.JobCategoryService;
import upp.upp.offer.Offer;
import upp.upp.offer.OfferService;
import upp.upp.user.User;

@RestController
@RequestMapping("/task")
public class TaskController {

	@Autowired
	private RuntimeService runtimeService;
	
	@Autowired
	private TaskService taskService;
	
	@Autowired
	private RequestForFavourService requestForFavourService;
	
	@Autowired
	private JobCategoryService jobCategoryService;
	
	@Autowired
	private OfferService offerService;
	
	@GetMapping("/getTaskForUser")
	public List<MockTask> getTaskForUser() {
		User user = getUserFromSession();
		List<MockTask> retVal = new ArrayList<>();
		
		List<Task> tasks= taskService.createTaskQuery().active().taskAssignee(user.getRandomKey()).list();
		
		for (Task task : tasks) {
			MockTask mockTask = new MockTask(task.getId(), task.getName());
			retVal.add(mockTask);
		}
		
		return retVal;
	}
	
	@GetMapping("/getTaskForCompany")
	public List<MockTask> getTaskForCompany() {
		User user = getUserFromSession();
		List<MockTask> retVal = new ArrayList<>();
		
		List<Task> tasks= taskService.createTaskQuery().active().taskAssignee(user.getId().toString()).list();
		
		for (Task task : tasks) {
			MockTask mockTask = new MockTask(task.getId(), task.getName());
			retVal.add(mockTask);
		}
		
		return retVal;
	}
	
	@GetMapping("/getRequestFromTask/{id}")
	public RequestForFavour confirmForward(@PathVariable String id) {
	
		HashMap<String, Object> variables=new HashMap<>();
		Task task = taskService.createTaskQuery().active().taskId(id).list().get(0);
		variables =(HashMap<String, Object>) runtimeService.getVariables(task.getProcessInstanceId());
		
		RequestForFavour  request = (RequestForFavour) variables.get("request");
		
		return request;
	}	
	
	@PostMapping("/cancelAllOffers")
	public void cancelAllOffers(@RequestBody MockTask mockTask) {
	
		HashMap<String, Object> variables=new HashMap<>();
		Task task = taskService.createTaskQuery().active().taskId(mockTask.getId()).list().get(0);
		variables =(HashMap<String, Object>) runtimeService.getVariables(task.getProcessInstanceId());
		variables.put("rangDecision", 0);
		
		taskService.complete(task.getId(),variables);
		
	}
	
	

	@PostMapping("/chooseRepeatProcess")
	public void chooseRepeatProcess(@RequestBody MockTask mockTask) {
	
		HashMap<String, Object> variables=new HashMap<>();
		Task task = taskService.createTaskQuery().active().taskId(mockTask.getId()).list().get(0);
		variables =(HashMap<String, Object>) runtimeService.getVariables(task.getProcessInstanceId());
		
		variables.put("rangDecision", 2);
		taskService.complete(task.getId(),variables);
		
	}
	
	@PostMapping("/repeatProcess")
	public void repeatProcess(@RequestBody MockTaskDate mockTask) {
	
		HashMap<String, Object> variables=new HashMap<>();
		Task task = taskService.createTaskQuery().active().taskId(mockTask.getId()).list().get(0);
		variables =(HashMap<String, Object>) runtimeService.getVariables(task.getProcessInstanceId());
		RequestForFavour request = (RequestForFavour) variables.get("request");
		request.setTimeLimitForOffers(mockTask.getDate());
		variables.put("request", request);
		
		
		taskService.complete(task.getId(),variables);
		
	}
	
	@PostMapping("/openRequiredExplainTask")
	public void openRequiredExplainTask(@RequestBody MockTaskOffer mockTask) {
	
		HashMap<String, Object> variables=new HashMap<>();
		Task task = taskService.createTaskQuery().active().taskId(mockTask.getTaskId()).list().get(0);
		variables =(HashMap<String, Object>) runtimeService.getVariables(task.getProcessInstanceId());
		
		
		Offer currentOffer = offerService.findOne(mockTask.getOfferId());
		variables.put("currentOffer", currentOffer);
		
		variables.put("rangDecision", 1);
		taskService.complete(task.getId(),variables);
		
	}
	
	@PostMapping("/sendRequiredExplain")
	public void sendRequiredExplainTask(@RequestBody MockTaskOffer mockTask) {
		
		HashMap<String, Object> variables=new HashMap<>();
		Task task = taskService.createTaskQuery().active().taskId(mockTask.getTaskId()).list().get(0);
		variables =(HashMap<String, Object>) runtimeService.getVariables(task.getProcessInstanceId());
		
		
		Offer currentOffer = offerService.findOne(mockTask.getOfferId());
		String text = mockTask.getText();
		variables.put("companyForRequirement", currentOffer.getCompany().getId());
		variables.put("requiredRequirement", 1);
		variables.put("textRequest", text);
		
		
		taskService.complete(task.getId(),variables);
		
	}
	
	@PostMapping("/withoutRequiredExplain")
	public void withoutRequiredExplain(@RequestBody MockTaskOffer mockTask) {
	
		HashMap<String, Object> variables=new HashMap<>();
		Task task = taskService.createTaskQuery().active().taskId(mockTask.getTaskId()).list().get(0);
		variables =(HashMap<String, Object>) runtimeService.getVariables(task.getProcessInstanceId());
		
		
		Offer currentOffer = offerService.findOne(mockTask.getOfferId());
		
		variables.put("companyForRequirement", currentOffer.getCompany().getId());
		variables.put("requiredRequirement", 0);
		variables.put("finishRequirement", 1);
		
		taskService.complete(task.getId(),variables);
		
	}
	
	@PostMapping("/getRequestFromTask")
	public Requirement getRequestFromTask(@RequestBody MockTask mockTask) {
	
		HashMap<String, Object> variables=new HashMap<>();
		Task task = taskService.createTaskQuery().active().taskId(mockTask.getId()).list().get(0);
		variables =(HashMap<String, Object>) runtimeService.getVariables(task.getProcessInstanceId());
		
		
		String text = (String) variables.get("textRequest");
		RequestForFavour request = (RequestForFavour) variables.get("request");
		Offer currentOffer = (Offer) variables.get("currentOffer");
	
		Requirement requirement = new Requirement();
		requirement.setText(text);
		requirement.setRequest(request);
		requirement.setOffer(currentOffer);
		
		return requirement;
	}
	
	
	@PostMapping("/confirmExplanation")
	public void confirmExplanation(@RequestBody MockTaskOffer mockTask) {
		HashMap<String, Object> variables=new HashMap<>();
		Task task = taskService.createTaskQuery().active().taskId(mockTask.getTaskId()).list().get(0);
		variables =(HashMap<String, Object>) runtimeService.getVariables(task.getProcessInstanceId());
		String text = mockTask.getText();
		variables.put("textResponse", text);
		taskService.complete(task.getId(),variables);
		
	}
	
	@PostMapping("/getTextFromTask")
	public MockTaskOffer getTextFromTask(@RequestBody MockTask mockTask) {
	
		HashMap<String, Object> variables=new HashMap<>();
		Task task = taskService.createTaskQuery().active().taskId(mockTask.getId()).list().get(0);
		variables =(HashMap<String, Object>) runtimeService.getVariables(task.getProcessInstanceId());
		
		
		String text = (String) variables.get("textResponse");
		Offer currentOffer = (Offer) variables.get("currentOffer");
		
		MockTaskOffer mockTaskOffer = new MockTaskOffer();
		mockTaskOffer.setText(text);
		mockTaskOffer.setTaskId(mockTask.getId());
		mockTaskOffer.setOfferId(currentOffer.getId());
		
		return mockTaskOffer;
	}
	
	
	@GetMapping("/otherOffers/{id}")
	public void otherOffers(@PathVariable String id) {
	
		HashMap<String, Object> variables=new HashMap<>();
		Task task = taskService.createTaskQuery().active().taskId(id).list().get(0);
		variables =(HashMap<String, Object>) runtimeService.getVariables(task.getProcessInstanceId());
		
		variables.put("finishRequirement", 0);
		variables.remove("currentOffer"); //prekontrolisati da li napravi posle haos
		variables.remove("textRequest");
		variables.remove("textResponse");
		
		taskService.complete(task.getId(),variables);
	}
	
	@GetMapping("/acceptThisOffer/{id}")
	public void acceptThisOffer(@PathVariable String id) {
	
		HashMap<String, Object> variables=new HashMap<>();
		Task task = taskService.createTaskQuery().active().taskId(id).list().get(0);
		variables =(HashMap<String, Object>) runtimeService.getVariables(task.getProcessInstanceId());
		
		variables.put("finishRequirement", 1);
		
		taskService.complete(task.getId(),variables);
	}
	
	@PostMapping("/determinationTimeStart")
	public void determinationTimeStart(@RequestBody MockTaskDate mockTask ) {
	
		HashMap<String, Object> variables=new HashMap<>();
		Task task = taskService.createTaskQuery().active().taskId(mockTask.getId()).list().get(0);
		variables =(HashMap<String, Object>) runtimeService.getVariables(task.getProcessInstanceId());
		
		Offer offer = (Offer) variables.get("currentOffer"); //da vidim da li radi ispravno
		
		variables.put("executingCompanyId", offer.getCompany().getId());
		taskService.complete(task.getId(),variables);
	}
	

	@PostMapping("/confirmEndExecution")
	public void confirmEndExecution(@RequestBody MockTask mockTask ) {
	
		HashMap<String, Object> variables=new HashMap<>();
		Task task = taskService.createTaskQuery().active().taskId(mockTask.getId()).list().get(0);
		variables =(HashMap<String, Object>) runtimeService.getVariables(task.getProcessInstanceId());
		
		//Offer offer = (Offer) variables.get("currentOffer"); //da vidim da li radi ispravno
		
		//variables.put("executingCompanyId", offer.getCompany().getId());
		taskService.complete(task.getId(),variables);
	}
	
	
	
	
	///////////////////////////pomocne
	@GetMapping("/getCurrentOfferFromTask/{id}")
	public Offer getCurrentOfferFromTask(@PathVariable String id) {
	
		HashMap<String, Object> variables=new HashMap<>();
		Task task = taskService.createTaskQuery().active().taskId(id).list().get(0);
		variables =(HashMap<String, Object>) runtimeService.getVariables(task.getProcessInstanceId());
		
		Offer  currentOffer = (Offer) variables.get("currentOffer");
		
		return currentOffer;
	}
	
	
	private User getUserFromSession() {
		ServletRequestAttributes attr = (ServletRequestAttributes) 
			    RequestContextHolder.currentRequestAttributes();
			HttpSession session= attr.getRequest().getSession(true); 
			return (User) session.getAttribute("korisnik");
	}
}
