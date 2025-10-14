package org.bisag.jktourism.repository;

import java.util.Optional;

import org.bisag.jktourism.models.User;
import org.bisag.jktourism.payload.response.UserProfileResponse;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
  Optional<User> findByUsername(String username);

  Optional<User> findByUuid(String uuid);

  boolean existsByUsername(String username);

  boolean existsByEmail(String email);

  boolean existsByMobile(String mobile);

  @Query("SELECT new org.bisag.jktourism.payload.response.UserProfileResponse(u.username, u.email, u.name, u.mobile, u.firstname, u.middlename, u.lastname) FROM User u WHERE u.username = :username")
  UserProfileResponse findUserProfileByUsername(@Param("username") String username);

}
