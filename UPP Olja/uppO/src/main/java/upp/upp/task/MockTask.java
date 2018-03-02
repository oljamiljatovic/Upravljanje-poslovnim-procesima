package upp.upp.task;

import lombok.Data;

@Data
public class MockTask {

	private String id;
	private String name;
	
	public MockTask() {
		
	}
	
	public MockTask(String id, String name) {
		this.id = id;
		this.name = name;
	}
	
}
