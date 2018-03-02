package upp.upp.jobCategory;

import org.springframework.data.repository.PagingAndSortingRepository;

public interface JobCategoryRepository  extends PagingAndSortingRepository<JobCategory, Long> {

	JobCategory findByName(String name);
	/*User findByEmail(String email);
	User findByRandomKey(String randomKey);
	User findByEmailAndPassword(String email,String password);
	User findByEmailAndUserName(String email,String userName);*/
}
