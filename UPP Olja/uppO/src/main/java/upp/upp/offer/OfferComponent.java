package upp.upp.offer;

import java.util.Collections;
import java.util.HashMap;
import java.util.List;

import javax.mail.MessagingException;
import javax.mail.internet.MimeMessage;
import javax.servlet.http.HttpSession;

import org.activiti.engine.RuntimeService;
import org.activiti.engine.TaskService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Component;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import upp.upp.OfferComparator;
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
		variables =(HashMap<String, Object>) runtimeService.getVariables(processInstanceId);
		
		if(foundedRequest.getOffers().size() == 0) {
			runtimeService.setVariable(processInstanceId, "rank", 1);
			
		}else {
			runtimeService.setVariable(processInstanceId, "rank", 0);
		}

		return getUserFromSession().getId().toString();
		
	}
	
	
	
	public void sendMailNotEnoughOffers(List<Offer> offers, RequestForFavour request, String instanceId) throws MessagingException{
		System.out.println("send mail not enough offers");
		
		MimeMessage message = mailSender.createMimeMessage();
		MimeMessageHelper helper = new MimeMessageHelper(message, true);
		helper.setFrom("isarestorani2@gmail.com");
		helper.setTo(request.getUser().getEmail());
		helper.setSubject("Registration request");
		String text = "Za Vas zahtjev nije ponudjen broj ponuda koji ste trazili. Molimo Vas odlucite o nastavku procesa";
		helper.setText(text);
		//mailSender.send(message);
	}

	
	/*funkcija koja ce izracunavati rank na osnovu ponuda*/
	private int getRank() {
		return 2;
	}
	
	public void rankingAllOffers(List<Offer> offers, RequestForFavour request, String processInstanceId) {
		Collections.sort(offers, new OfferComparator());
		//dopuniti sa sortiranjem po cijeni
		System.out.println("sortiranje....");
	}
	
	
	
	private User getUserFromSession() {
		ServletRequestAttributes attr = (ServletRequestAttributes)RequestContextHolder.currentRequestAttributes();
		HttpSession session= attr.getRequest().getSession(true);
		User u = (User) session.getAttribute("korisnik");
		return u;
	}
}
