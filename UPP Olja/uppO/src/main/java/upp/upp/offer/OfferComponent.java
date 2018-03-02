package upp.upp.offer;

import java.util.HashMap;
import java.util.List;

import javax.servlet.http.HttpSession;

import org.activiti.engine.RuntimeService;
import org.activiti.engine.TaskService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Component;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import upp.upp.RequestForFavour.RequestForFavour;
import upp.upp.RequestForFavour.RequestForFavourService;
import upp.upp.user.User;
import upp.upp.user.UserService;

@Component
public class OfferComponent {

	
	@Autowired
	private UserService userService;
	@Autowired
	private RequestForFavourService requestForFavourService;
	
	@Autowired
	private TaskService taskService;
	@Autowired
	private JavaMailSender mailSender;
	
	@Autowired
	private RuntimeService runtimeService;
	
	public String getRank(OfferDTO currentOffer, String processInstanceId) {
		System.out.println("getRank");
		RequestForFavour foundedRequest = requestForFavourService.findOne(currentOffer.getIdRequest());
		
		
		HashMap<String, Object> variables=new HashMap<>();
		//Task task = taskService.createTaskQuery().active().taskId(processInstanceId).list().get(0);
		variables =(HashMap<String, Object>) runtimeService.getVariables(processInstanceId);
		
		
		if(foundedRequest.getOffers().size() == 0) {
			runtimeService.setVariable(processInstanceId, "rank", 1);
			
		}else {
			runtimeService.setVariable(processInstanceId, "rank", 0);
			
		}
		
		return getUserFromSession().getId().toString();
		
		
	}
	
	
	
	public void sendMailNotEnoughOffers(List<Offer> offers, RequestForFavour request, String instanceId){
		System.out.println("send mail not enough offers");
	}
	
	public void druga(List<Offer> offers) {
		System.out.println("druga, tj. tacan broj ");
	}
	
	/*funkcija koja ce izracunavati rank na osnovu ponuda*/
	private int getRank() {
		return 2;
	}
	
	private User getUserFromSession() {
		ServletRequestAttributes attr = (ServletRequestAttributes)RequestContextHolder.currentRequestAttributes();
		HttpSession session= attr.getRequest().getSession(true);
		User u = (User) session.getAttribute("korisnik");
		return u;
	}
}
