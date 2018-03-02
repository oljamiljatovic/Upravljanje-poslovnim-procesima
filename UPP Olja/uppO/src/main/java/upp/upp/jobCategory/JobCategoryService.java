package upp.upp.jobCategory;

import java.util.List;

public interface JobCategoryService {
	
	List<JobCategory> findAll();

	//JobCategory save(MockUser obj);

	JobCategory findOne(Long id);
	
	JobCategory findByName(String name);


}
