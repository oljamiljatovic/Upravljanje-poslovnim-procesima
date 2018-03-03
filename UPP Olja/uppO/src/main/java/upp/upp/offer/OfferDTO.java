package upp.upp.offer;

import java.io.Serializable;
import java.util.Date;

import lombok.Data;

@Data
public class OfferDTO implements Serializable {

	private long idRequest;
	
	private Date timeLimit;
	
	private double price;

	private long idCompany;
	
	public OfferDTO() {
		
	}
	
	
	
}
