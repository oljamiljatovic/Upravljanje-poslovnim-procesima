package upp.upp.RequestForFavour;

import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Random;

import javax.mail.MessagingException;
import javax.mail.internet.MimeMessage;

import org.activiti.engine.RuntimeService;
import org.activiti.engine.TaskService;
import org.activiti.engine.runtime.ProcessInstance;
import org.activiti.engine.task.Task;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Component;

import com.squareup.okhttp.Request;

import upp.upp.jobCategory.JobCategory;
import upp.upp.user.User;
import upp.upp.user.UserService;

@Component
public class RequestForFavourComponent {
	
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
	
	public List<User> createListOfCompanies(RequestForFavour request) {
		
		List<User> users = userService.findAll();
		
		List<User> foundedUsers = new ArrayList<>();
		
		for (User user : users) {
			for (JobCategory category : user.getCategories()) {
				double distance = getDistance(request.getUser().getLatitude(), user.getLatitude(), request.getUser().getLongitude(), user.getLongitude(), 0, 0);
				if(category.getId() == request.getJobCategory().getId() && (distance < user.getDistance())) {
					foundedUsers.add(user);
				}
			}
		}
		
		List<User> lista = new ArrayList<>();
		if(foundedUsers.size() > request.getMaxNumberOffers()) {
			lista =  getRandomCompanies(foundedUsers, request.getMaxNumberOffers());
		}else {
			lista = foundedUsers;
		}
		
		
		HashMap<String, Object> variables=new HashMap<>();
	
		RequestForFavour temp =  requestForFavourService.findOne(request.getId());
		temp.setSelectedCompanies(lista);
		temp = requestForFavourService.save(temp);
		
		Task t= taskService.createTaskQuery().active().list().get(0);
		taskService.setVariable(t.getId(), "request", temp);
		taskService.setVariable(t.getId(), "lista", lista);
		
		return lista;
	}
	
	private ArrayList<User> getRandomCompanies(List<User> foundedCompanies, int numberOfOffers) {
		Random randomGenerator = new Random();
		ArrayList<User> retVal = new ArrayList<>();
		Collections.shuffle(foundedCompanies);
		
		while(numberOfOffers != 0) {
			int index = randomGenerator.nextInt(foundedCompanies.size());
			User item = foundedCompanies.get(index);
			retVal.add(item);
			numberOfOffers--;
		}
		return retVal;
	}
	private double getDistance(double lat1, double lat2, double lon1,
	        double lon2, double el1, double el2) {

	    final int R = 6371; // Radius of the earth
	    double latDistance = Math.toRadians(lat2 - lat1);
	    double lonDistance = Math.toRadians(lon2 - lon1);
	    double a = Math.sin(latDistance / 2) * Math.sin(latDistance / 2)
	            + Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2))
	            * Math.sin(lonDistance / 2) * Math.sin(lonDistance / 2);
	    double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
	    double distance = R * c * 1000; // convert to meters
	    double height = el1 - el2;
	    distance = Math.pow(distance, 2) + Math.pow(height, 2);
	    double distanceMeters = Math.sqrt(distance);
	    return distanceMeters/1000;
	}
	
	public void sendMailNoCompanies(RequestForFavour request) throws MessagingException  {
		MimeMessage message = mailSender.createMimeMessage();
		MimeMessageHelper helper = new MimeMessageHelper(message, true);
		helper.setFrom("isarestorani@gmail.com");
		helper.setTo(request.getUser().getEmail());
		helper.setSubject("Obavjestenje o zahtjevu");
		String text = "U sistemu ne postoje firme koje zadovoljavaju uslove za Vas zahtjev.";
		helper.setText(text);
		//RequestForFavourComponent.mailSender.send(message);
	
	}
	
	public void sendMailNotEnoughCompanies(RequestForFavour request, List<User> companies) throws MessagingException {
		System.out.println("pROSAO GATEWAJ 2");
		MimeMessage message = mailSender.createMimeMessage();
		MimeMessageHelper helper = new MimeMessageHelper(message, true);
		helper.setFrom("isarestorani@gmail.com");
		helper.setTo(request.getUser().getEmail());
		helper.setSubject("Obavjestenje o zahtjevu");
		String text = "U sistemu ne postoji izabran broj firmi koje zadovoljavaju uslove za Vas zahtjev. Molimo Vas odaberite da li zelite da se proslijede ponude firmama koje su pronadjene.\n";
		text += "\nAko prihvatate kliknite na link : \t localhost:8080/requestForFavour/confirmForward/"+request.getId();
		text += "\nAko ne prihvatate kliknite na link : \\t  localhost:8080/requestForFavour/rejectForward/";
		//text += "<a href=\"localhost:8080/requestForFavour/confirmForward\">Confirm</a>";
		//message.setContent(text, "text/html; charset=utf-8");
		
		helper.setText(text);
		//mailSender.send(message);
			
	}
	public String sendMailToCompany(User user, RequestForFavour request, String instanceId) throws MessagingException   {
		System.out.println("PRODJIIIIIIIII");
		
		/*Treba dopuniti obavjestavanje firmi preko mail-a*/
		
	/*	for (User company : request.getSelectedCompanies()) {
			System.out.println(company.getId());
			
			MimeMessage message = mailSender.createMimeMessage();
			MimeMessageHelper helper = new MimeMessageHelper(message, true);
			helper.setFrom("isarestorani@gmail.com");
			helper.setTo(company.getEmail());
			helper.setSubject("Pristigao zahtjev");
			String text = "Dobili ste zahtjev, molimo Vas da popunite svoju ponudu.";
			
			helper.setText(text);
			//mailSender.send(message);
		}*/
		//return request.getSelectedCompanies();
		//HashMap<String, Object> variables=new HashMap<>();
	
		//variables =(HashMap<String, Object>) runtimeService.getVariables(instanceId);
		//variables.put("CompanyID", user.getId());
		return user.getId().toString();
		
	}
	
	
	
	
}
