package upp.upp.jobCategory;

import java.util.ArrayList;
import java.util.List;
import java.util.Random;

import javax.transaction.Transactional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.google.common.collect.Lists;

@Service
@Transactional
public class JobCategoryImpl implements JobCategoryService {
	
	private final JobCategoryRepository repository;

	@Autowired
	public JobCategoryImpl(final JobCategoryRepository repository) {
		this.repository = repository;
	}

	@Override
	public List<JobCategory> findAll() {
		return (List<JobCategory>) repository.findAll();
	}

	@Override
	public JobCategory findOne(Long id) {
		return repository.findOne(id);
	}

	@Override
	public JobCategory findByName(String name) {
		return repository.findByName(name);
	}

	
}
