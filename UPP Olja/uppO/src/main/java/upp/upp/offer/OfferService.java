package upp.upp.offer;

import java.util.List;

import org.springframework.stereotype.Service;

@Service
public interface OfferService {

	List<Offer> findAll();

	Offer save(Offer obj);

	Offer findOne(Long id);
}
