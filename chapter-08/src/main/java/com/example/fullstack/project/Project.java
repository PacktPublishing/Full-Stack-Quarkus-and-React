package com.example.fullstack.project;

import com.example.fullstack.user.User;
import io.quarkus.hibernate.reactive.panache.PanacheEntity;
import org.hibernate.annotations.CreationTimestamp;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.ManyToOne;
import javax.persistence.Table;
import javax.persistence.UniqueConstraint;
import javax.persistence.Version;
import java.time.ZonedDateTime;

@Entity
@Table(
  name = "projects",
  uniqueConstraints = {
    @UniqueConstraint(columnNames = {"name", "user_id"})
  }
)
public class Project extends PanacheEntity {

  @Column(nullable = false)
  public String name;

  @ManyToOne(optional = false)
  public User user;

  @CreationTimestamp
  @Column(updatable = false, nullable = false)
  public ZonedDateTime created;

  @Version
  public int version;
}
