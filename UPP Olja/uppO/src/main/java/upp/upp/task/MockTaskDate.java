package upp.upp.task;

import java.io.Serializable;
import java.util.Date;

import lombok.Data;

@Data
public class MockTaskDate implements Serializable {
	
	private String id;
	private String name;
	private Date date;
	
	public MockTaskDate() {
		
	}
}
