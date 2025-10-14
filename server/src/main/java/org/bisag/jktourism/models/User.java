package org.bisag.jktourism.models;

import java.time.LocalDateTime;
import java.util.Date;
import java.util.HashSet;
import java.util.Set;
import java.util.UUID;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "users", uniqueConstraints = {
    @UniqueConstraint(columnNames = "username"),
    @UniqueConstraint(columnNames = "email")
})
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class User {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @NotBlank
  @Size(max = 50)
  @Column(unique = true, nullable = false)
  private String username;

  @CreationTimestamp
  @Column(updatable = false)
  private Date createdon;

  @UpdateTimestamp
  @Column(updatable = true)
  private Date updatedon;

  @Max(1)
  private int isactive = 1;

  @NotBlank(message = "Mobile number cannot be blank")
  @Pattern(regexp = "^[6-9][0-9]{9}$", message = "Mobile number must be exactly 10 digits and start with 6, 7, 8, or 9")
  @Size(max = 10)
  private String mobile;

  @NotBlank
  @Size(max = 50)
  @Email
  private String email;

  @NotBlank
  @Size(max = 120)
  private String password;

  @NotBlank
  @Size(max = 20)
  private String firstname;

  @Size(max = 20)
  private String middlename;

  @NotBlank
  @Size(max = 20)
  private String lastname;

  @NotBlank
  @Size(max = 60)
  private String name;

  @NotBlank
  @Size(max = 80)
  @Column(unique = true, nullable = false)
  private String uuid;

  private LocalDateTime passwordChangedAt;

  @PrePersist
  @PreUpdate
  private void setUuidAndFullNameOnCreate() {
    this.name = (middlename != null && !middlename.isEmpty())
        ? (firstname + " " + middlename + " " + lastname).trim()
        : (firstname + " " + lastname).trim();

    this.uuid = (this.uuid == null) ? UUID.randomUUID().toString() : this.uuid;
  }

  @ManyToMany(fetch = FetchType.LAZY)
  @JoinTable(name = "user_roles", joinColumns = @JoinColumn(name = "user_id"), inverseJoinColumns = @JoinColumn(name = "role_id"))
  private Set<Role> roles = new HashSet<>();

}