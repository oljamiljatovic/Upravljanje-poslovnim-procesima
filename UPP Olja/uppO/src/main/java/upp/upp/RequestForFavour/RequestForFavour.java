package upp.upp.RequestForFavour;

import java.util.ArrayList;
import java.util.Date;
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
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;

import lombok.Data;
import upp.upp.jobCategory.JobCategory;
import upp.upp.offer.Offer;
import upp.upp.user.User;

@Data
@Entity
public class RequestForFavour {

	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	@Column(name = "REQUEST_ID")
	private Long id;
	
	@ManyToOne
	@JoinColumn(name="JOB_CATEGORY")
	private JobCategory jobCategory;
	
	private String description;
	
	private Double maxValuation;
	
	private Date timeLimitForOffers;
	
	private int maxNumberOffers;
	
	private Date timeLimitForCarryOut;
	
	@ManyToOne
	@JoinColumn(name="USER_ID")
	private User user;
	
	@ManyToMany(cascade=CascadeType.ALL) 
	@JoinTable(name="REQUEST_COMPANY", joinColumns=@JoinColumn(name="REQUEST_ID"),inverseJoinColumns=@JoinColumn(name="COMPANY_ID"))
	private List<User> selectedCompanies;
	
	@OneToMany(cascade=CascadeType.ALL) 
	private List<Offer> offers;
	
	
	public RequestForFavour() {
		
	}
	
	public RequestForFavour(RequestForFavourDTO dto, JobCategory jobCategory, User user) {
		this.jobCategory = jobCategory;
		this.description = dto.getDescription();
		this.maxValuation = dto.getMaxValuation();
		this.timeLimitForOffers = dto.getTimeLimitForOffers();
		this.maxNumberOffers = dto.getMaxNumberOffers();
		this.timeLimitForCarryOut = dto.getTimeLimitForCarryOut();
		this.user = user;
		this.selectedCompanies  =  new ArrayList<>();
		this.offers = new ArrayList<>();
		
	
	}
	
}
