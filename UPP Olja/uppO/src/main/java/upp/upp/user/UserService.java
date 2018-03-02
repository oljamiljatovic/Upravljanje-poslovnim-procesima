package upp.upp.user;

import java.util.List;

public interface UserService {
	List<User> findAll();

	User save(User obj);

	User findOne(Long id);
	
	User findOneByEmailAndPassword(String email,String password);

	User findOneByEmailOrUserName(String email,String userName);

	User findOneByRandomKey(String key);

	void delete(Long id);
	
	String generateRandomKey();

	User findOneByUsernameAndPassword(String userName, String password);
}
