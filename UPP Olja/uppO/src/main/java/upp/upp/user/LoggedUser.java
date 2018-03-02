package upp.upp.user;

import lombok.Data;

@Data
public class LoggedUser {

	private String text;
	private int role;
	
	public LoggedUser() {
		
	}
	
	public LoggedUser(String text, int role) {
		this.text = text;
		this.role = role;
	}
}
