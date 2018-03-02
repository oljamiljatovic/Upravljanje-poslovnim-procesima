package upp.upp.RequestForFavour;

import java.util.List;

import upp.upp.user.User;


public interface RequestForFavourService {

	List<RequestForFavour> findAll();

	RequestForFavour save(RequestForFavour obj);

	RequestForFavour findOne(Long id);
}
