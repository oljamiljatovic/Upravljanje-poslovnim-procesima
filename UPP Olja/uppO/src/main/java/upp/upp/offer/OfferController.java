package upp.upp.offer;

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
import upp.upp.task.MockTask;
import upp.upp.task.MockTaskDate;
import upp.upp.user.User;
import upp.upp.user.UserService;

@RestController
@RequestMapping("/offer")
public class OfferController {

	@Autowired
	private RuntimeService runtimeService;
	
	@Autowired
	private OfferService offerService;
	
	@Autowired
	private TaskService taskService;
	
	@Autowired
	private RequestForFavourService requestForFavourService;
	
	@Autowired
	private JobCategoryService jobCategoryService;
	
	@Autowired
	private UserService userService;
	
	
	
	@PostMapping(path = "/addOfferToRequest/{id}")
	public int add(@PathVariable String id,@RequestBody OfferDTO offerDTO) {
		System.out.println("sdafaaf");
		offerDTO.setIdCompany(getUserFromSession().getId());
		HashMap<String, Object> variables=new HashMap<>();
		Task task = taskService.createTaskQuery().active().taskId(id).list().get(0);
		variables =(HashMap<String, Object>) runtimeService.getVariables(task.getProcessInstanceId());
		
		List<Offer> offers = new ArrayList<>();
		variables.put("currentOffer", offerDTO);
		if(variables.get("offers") == null) {
			variables.put("offers", offers);
		}
		taskService.complete(task.getId(),variables);
		variables =(HashMap<String, Object>) runtimeService.getVariables(task.getProcessInstanceId());
		int rank = (int) variables.get("rank");
		System.out.println("bilo ta");
		return rank;
		
	}
	
	@PostMapping(path = "/confirmFinalOffer")
	public void confirmFinalOffer(@RequestBody MockTask mockTask) {
		HashMap<String, Object> variables=new HashMap<>();
		Task task = taskService.createTaskQuery().active().taskId(mockTask.getId()).list().get(0);
		variables =(HashMap<String, Object>) runtimeService.getVariables(task.getProcessInstanceId());
		
		variables.put("finalDecision", 1);
		
		
		RequestForFavour requestFromActiviti  = (RequestForFavour) variables.get("request");
		RequestForFavour foundedRequest = requestForFavourService.findOne(requestFromActiviti.getId());
		
		OfferDTO offerDTO = (OfferDTO) variables.get("currentOffer");
		Offer offer = new Offer();
		offer.setTimeLimit(offerDTO.getTimeLimit());
		offer.setPrice(offerDTO.getPrice());
		offer.setRequest(foundedRequest);
		offer.setCompany(userService.findOne(offerDTO.getIdCompany()));
		offer = offerService.save(offer);
				
		if(foundedRequest.getOffers()== null) {
			List<Offer> offers = new ArrayList<>();
			offers.add(offer);
			foundedRequest.setOffers(offers);
		}else if(foundedRequest.getOffers().size() == 0) {
			foundedRequest.getOffers().add(offer);
					
		}else {
			foundedRequest.getOffers().add(offer);
		}
				
		foundedRequest = requestForFavourService.save(foundedRequest);
				
		
				
		if(variables.get("offers") == null) {
			List<Offer> offersVariable = new ArrayList<>();
			offersVariable.add(offer);
			variables.put("offers", offersVariable);
		}else {
			List<Offer> offers = (List<Offer>) variables.get("offers");
			offers.add(offer);
			variables.put("offers", offers);
		}
		
 		taskService.complete(task.getId(),variables);
	}
	
	@PostMapping(path = "/returnToCorrection")
	public void returnToCorrection(@RequestBody MockTask mockTask) {
		HashMap<String, Object> variables=new HashMap<>();
		Task task = taskService.createTaskQuery().active().taskId(mockTask.getId()).list().get(0);
		variables =(HashMap<String, Object>) runtimeService.getVariables(task.getProcessInstanceId());
		
		variables.put("finalDecision", 0);
		taskService.complete(task.getId(),variables);
	}
	
/*sve metode vezane za odlucivanje oko nedovoljno ili nikako ponuda */	
	@PostMapping(path = "/chooseDecide")
	public void returnToCorrchooseDecideection(@RequestBody MockTask mockTask) {
		HashMap<String, Object> variables=new HashMap<>();
		Task task = taskService.createTaskQuery().active().taskId(mockTask.getId()).list().get(0);
		variables =(HashMap<String, Object>) runtimeService.getVariables(task.getProcessInstanceId());
		
		variables.put("decisionAboutOffers", 0);
		taskService.complete(task.getId(),variables);
	}
	
	@PostMapping(path = "/sendDateNotEnough")
	public void sendDateNotEnough(@RequestBody MockTaskDate mockTask) {
		HashMap<String, Object> variables=new HashMap<>();
		Task task = taskService.createTaskQuery().active().taskId(mockTask.getId()).list().get(0);
		variables =(HashMap<String, Object>) runtimeService.getVariables(task.getProcessInstanceId());
		//treba podesiti novi datum
		variables.put("decisionAboutOffers", 1);
		taskService.complete(task.getId(),variables);
	}
	
	
	@PostMapping(path = "/cancelNoOffers")
	public void cancelNoOffers(@RequestBody MockTask mockTask) {
		HashMap<String, Object> variables=new HashMap<>();
		Task task = taskService.createTaskQuery().active().taskId(mockTask.getId()).list().get(0);
		variables =(HashMap<String, Object>) runtimeService.getVariables(task.getProcessInstanceId());
		
		variables.put("decisionAboutNoOffers", 0);
		taskService.complete(task.getId(),variables);
	}
	
	
	@PostMapping(path = "/sendDateNoOffers")
	public void sendDateNoOffers(@RequestBody MockTaskDate mockTask) {
		HashMap<String, Object> variables=new HashMap<>();
		Task task = taskService.createTaskQuery().active().taskId(mockTask.getId()).list().get(0);
		variables =(HashMap<String, Object>) runtimeService.getVariables(task.getProcessInstanceId());
		//treba podesiti novi datum
		variables.put("decisionAboutNoOffers", 1);
		taskService.complete(task.getId(),variables);
	}
	
/*sve metode vezane za odlucivanje KRAJ*/	
	@PostMapping(path = "/getRangList")
	public List<Offer> getRangList(@RequestBody MockTask mockTask) {
		HashMap<String, Object> variables=new HashMap<>();
		
		Task task = taskService.createTaskQuery().active().taskId(mockTask.getId()).list().get(0);
		variables =(HashMap<String, Object>) runtimeService.getVariables(task.getProcessInstanceId());
		
		List<Offer> offers = (List<Offer>) variables.get("offers");
		
		return offers;
	}
	

	
	public User getUserFromSession() {
		ServletRequestAttributes attr = (ServletRequestAttributes)RequestContextHolder.currentRequestAttributes();
		HttpSession session= attr.getRequest().getSession(true);
		User u = (User) session.getAttribute("korisnik");
		return u;
	}
}
