package upp.upp.user;

import org.springframework.data.repository.PagingAndSortingRepository;

public interface UserRepository  extends PagingAndSortingRepository<User, Long> {

	User findByUserName(String userName);
	User findByEmail(String email);
	User findByRandomKey(String key);
	User findByEmailAndPassword(String email,String password);
	User findByEmailOrUserName(String email,String userName);
	User findOneByUserNameAndPassword(String userName, String password);
}
