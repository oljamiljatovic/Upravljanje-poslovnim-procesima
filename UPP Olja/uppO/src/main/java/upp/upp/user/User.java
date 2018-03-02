package upp.upp.user;

import java.util.ArrayList;
import java.util.List;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.JoinTable;
import javax.persistence.ManyToMany;

import lombok.Data;
import upp.upp.jobCategory.JobCategory;

@Data
@Entity
public class User {
	
	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	@Column(name = "USER_ID")
	private Long id;

	private String name;
	private String email;
	private String userName;
	private String password;
	private String address;
	private String city;
	private String postNumber;
	private int registrated;	
	private int role;
	
	@ManyToMany(cascade=CascadeType.ALL) 
	@JoinTable(name="USER_CATEGORY_JOB", joinColumns=@JoinColumn(name="USER_ID"),inverseJoinColumns=@JoinColumn(name="JOB_ID"))
	private List<JobCategory> categories;
	private double distance;
	
	private String randomKey;
	private double longitude;
	private double latitude;
	
	public User() {}
	
	
	public User(MockUser obj, ArrayList<JobCategory> categories) {
		name = obj.getName();
		email = obj.getEmail();
		userName = obj.getUserName();
		password = obj.getPassword();
		address = obj.getAddress();
		city = obj.getCity();
		postNumber = obj.getPostNumber();
		randomKey = obj.getRandomKey();
		role = obj.getRole();
		latitude = obj.getLatitude();
		longitude = obj.getLongitude();
		registrated = obj.getRegistrated();
		this.categories = categories;
	}
	
	
}
