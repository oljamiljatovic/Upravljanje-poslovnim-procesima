package upp.upp.user;

import static org.mockito.Mockito.mock;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpSession;

import org.activiti.engine.RepositoryService;
import org.activiti.engine.RuntimeService;
import org.activiti.engine.TaskService;
import org.activiti.engine.task.Task;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

@RestController
@RequestMapping("/user")
public class UserController {

	@Autowired
	private UserService userService;

	@Autowired
	private RuntimeService runtimeService;
	
	@Autowired
	private RepositoryService repositoryService;
	
	@Autowired
	private TaskService taskService;
	
	
	@GetMapping
	public ResponseEntity<List<User>> findAll() {
		return new ResponseEntity<>(userService.findAll(), HttpStatus.OK);
	}
	
	@DeleteMapping(path = "/{id}")
	@ResponseStatus(HttpStatus.NO_CONTENT)
	public void delete(@PathVariable Long id) {
		userService.delete(id);
	}
	
	@PostMapping(path= "logIn")
	public LoggedUser logIn(@RequestBody User obj) {
		User user = userService.findOneByUsernameAndPassword(obj.getUserName(), obj.getPassword());
		LoggedUser loggedUser = new LoggedUser();
		
		
		if(user == null) {
			loggedUser.setText("Neispravni podaci");
		}else {
			
			ServletRequestAttributes attr = (ServletRequestAttributes) 
				    RequestContextHolder.currentRequestAttributes();
				HttpSession session= attr.getRequest().getSession(true); 
				session.setAttribute("korisnik", user);
			loggedUser.setText("Uspjesno");
			loggedUser.setRole(user.getRole());
			
		}
		
		return loggedUser;
	}	
	
	
	@GetMapping(path= "logOut")
	public String logOut() {
		String retVal = "";
	
		ServletRequestAttributes attr = (ServletRequestAttributes) 
			    RequestContextHolder.currentRequestAttributes();
		
		HttpSession session= attr.getRequest().getSession(true);
		session.invalidate();
		
		return retVal = "Uspjesno";
	}	
	
	@PostMapping
	public MockUser add(@RequestBody Map<String,String>map) {
		MockUser obj = generateMockUser(map); 
		String retVal = "";
	
		HashMap<String, Object> variables=new HashMap<>();
		String key = userService.generateRandomKey();
		variables.put("userKey",key);
		runtimeService.startProcessInstanceByKey("registrationProcess",variables);
		
		Task t= taskService.createTaskQuery().active().taskAssignee(key).list().get(0);
		variables =(HashMap<String, Object>) runtimeService.getVariables(t.getProcessInstanceId());
		obj.setRandomKey(key);
		variables.put("user", obj);
		taskService.complete(t.getId(),variables);
		
		return obj;
	}	
	
	private MockUser generateMockUser(Map<String,String> map) {
		MockUser mockUser  = new MockUser();
		mockUser.setName(map.get("nameProp"));
		mockUser.setUserName(map.get("userNameProp"));
		mockUser.setEmail(map.get("emailProp"));
		mockUser.setPassword(map.get("passwordProp"));
		mockUser.setAddress(map.get("addressProp"));
		mockUser.setCity(map.get("cityProp"));
		mockUser.setPostNumber(map.get("postNumberProp"));
		mockUser.setRole(Integer.parseInt(map.get("roleProp")));
		return mockUser;
	}
	
	@PostMapping(path="/addCompany")
	public MockUser addCompany(@RequestBody MockUser obj) {
		String retVal = "";
		HashMap<String, Object> variables=new HashMap<>();
		variables.put("userKey",obj.getRandomKey());
		Task t= taskService.createTaskQuery().active().taskAssignee(obj.getRandomKey()).list().get(0);
		
		variables =(HashMap<String, Object>) runtimeService.getVariables(t.getProcessInstanceId());
		variables.put("user", obj);
		taskService.complete(t.getId(),variables);
	
		return obj;
	}	
	
	@GetMapping("/confirmRegistration/{key}")
	public void confirmRegistration(@PathVariable String key) {
		HashMap<String, Object> variables=new HashMap<>();
		User u = userService.findOneByRandomKey(key);
		if(u != null) {
			variables.put("user",new MockUser(u));		
			runtimeService.signalEventReceived("alert",variables);
		}
	}

	
}
