package upp.upp.offer;

import java.util.List;

import javax.transaction.Transactional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import upp.upp.user.UserRepository;

@Service
@Transactional
public class OfferServiceImpl implements OfferService {

	private final OfferRepository repository;

	@Autowired
	public OfferServiceImpl(final OfferRepository repository) {
		this.repository = repository;
	}

	@Override
	public List<Offer> findAll() {
		return (List<Offer>) repository.findAll();
	}

	@Override
	public Offer save(Offer obj) {
		return repository.save(obj);
	}

	@Override
	public Offer findOne(Long id) {
		return repository.findOne(id);
	}
}
