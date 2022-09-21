package com.example.fullstack.user;

import com.example.fullstack.project.Project;
import com.example.fullstack.task.Task;
import io.quarkus.elytron.security.common.BcryptUtil;
import io.quarkus.hibernate.reactive.panache.common.runtime.ReactiveTransactional;
import io.smallrye.mutiny.Uni;
import org.hibernate.ObjectNotFoundException;

import javax.enterprise.context.ApplicationScoped;
import java.util.List;

@ApplicationScoped
public class UserService {

  public Uni<User> findById(long id) {
    return User.<User>findById(id)
      .onItem().ifNull().failWith(() -> new ObjectNotFoundException(id, "User"));
  }

  public Uni<User> findByName(String name) {
    return User.find("name", name).firstResult();
  }

  public Uni<List<User>> list() {
    return User.listAll();
  }

  @ReactiveTransactional
  public Uni<User> create(User user) {
    user.password = BcryptUtil.bcryptHash(user.password);
    return user.persistAndFlush();
  }

  @ReactiveTransactional
  public Uni<User> update(User user) {
    return findById(user.id)
      .chain(u -> User.getSession())
      .chain(s -> s.merge(user));
  }

  @ReactiveTransactional
  public Uni<Void> delete(long id) {
    return findById(id)
      .chain(u -> Uni.combine().all().unis(
            Task.delete("user.id", u.id),
            Project.delete("user.id", u.id)
          ).asTuple()
          .chain(t -> u.delete())
      );
  }

  public Uni<User> getCurrentUser() {
    // TODO: replace implementation once security is added to the project
    return User.find("order by ID").firstResult();
  }
}
