package org.bisag.jktourism.security.services;

import org.bisag.jktourism.models.User;
import org.bisag.jktourism.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class UserDetailsServiceImpl implements UserDetailsService {
  @Autowired
  UserRepository userRepository;

  @Override
  @Transactional
  public UserDetails loadUserByUsername(String userUUID) throws UsernameNotFoundException {
    User user;
    String emailRegex = "^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+$";

    if (userUUID.matches(emailRegex)) {
      // It's an email
      user = userRepository.findByUsername(userUUID)
          .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + userUUID));
    } else {
      // It's assumed to be a UUID
      user = userRepository.findByUuid(userUUID)
          .orElseThrow(() -> new UsernameNotFoundException("User not found with UUID: " + userUUID));
    }

    return UserDetailsImpl.build(user);
  }

}
