package upp.upp.offer;

import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;

import lombok.Data;
import upp.upp.RequestForFavour.RequestForFavour;

@Data
@Entity
public class Offer {

	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	@Column(name = "OFFER_ID")
	private Long id;
	
	private double price; 
	
	private Date timeLimit;
	
	@com.fasterxml.jackson.annotation.JsonIgnore
	@ManyToOne
	@JoinColumn(name="REQUEST_ID")
	private RequestForFavour request;
	

	public Offer() {
		
	}
	
	
}
