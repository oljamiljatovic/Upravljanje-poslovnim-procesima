package upp.upp.RequestForFavour;

import java.util.List;

import javax.transaction.Transactional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import upp.upp.user.User;

@Service
@Transactional
public class RequestForFavourServiceImpl implements RequestForFavourService {

	private final RequestForFavourRepository repository;
	
	@Autowired
	public RequestForFavourServiceImpl(final RequestForFavourRepository repository) {
		this.repository = repository;
	}

	@Override
	public List<RequestForFavour> findAll() {
		return (List<RequestForFavour>) repository.findAll();
	}

	@Override
	public RequestForFavour save(RequestForFavour obj) {
		return repository.save(obj);
	}

	@Override
	public RequestForFavour findOne(Long id) {
		return repository.findOne(id);
	}

}
