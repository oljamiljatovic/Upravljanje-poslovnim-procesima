package upp.upp.task;

import lombok.Data;
import upp.upp.RequestForFavour.RequestForFavour;
import upp.upp.offer.Offer;

@Data
public class Requirement {

	private String text; 
	private RequestForFavour request;
	private Offer offer;
	public Requirement() {
		
	}
}
