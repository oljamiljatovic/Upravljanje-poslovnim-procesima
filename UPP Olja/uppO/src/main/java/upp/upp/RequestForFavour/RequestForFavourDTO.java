package upp.upp.RequestForFavour;

import java.util.Date;

import lombok.Data;

@Data
public class RequestForFavourDTO {

	private Long jobCategoryID;
	
	private String description;
	
	private Double maxValuation;
	
	private Date timeLimitForOffers;
	
	private int maxNumberOffers;
	
	private Date timeLimitForCarryOut;
	
	
	
	public RequestForFavourDTO() {
		
	}
	
}

