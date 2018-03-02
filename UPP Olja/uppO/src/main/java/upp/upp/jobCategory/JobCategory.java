package upp.upp.jobCategory;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;

import lombok.Data;

@Data
@Entity
public class JobCategory {
	
	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	@Column(name = "JOB_ID")
	private Long id;
	
	private String name;

	public JobCategory(String name) {
		this.name = name;
	}
	
	public JobCategory() {
		
	}
	
}
