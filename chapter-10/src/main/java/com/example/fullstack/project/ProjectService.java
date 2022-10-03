package com.example.fullstack.project;

import com.example.fullstack.task.Task;
import com.example.fullstack.user.UserService;
import io.quarkus.hibernate.reactive.panache.common.runtime.ReactiveTransactional;
import io.quarkus.security.UnauthorizedException;
import io.smallrye.mutiny.Uni;
import org.hibernate.ObjectNotFoundException;

import javax.enterprise.context.ApplicationScoped;
import javax.inject.Inject;
import java.util.List;

@ApplicationScoped
public class ProjectService {

  private final UserService userService;

  @Inject
  public ProjectService(UserService userService) {
    this.userService = userService;
  }

  public Uni<Project> findById(long id) {
    return userService.getCurrentUser()
      .chain(user -> Project.<Project>findById(id)
        .onItem().ifNull().failWith(() -> new ObjectNotFoundException(id, "Project"))
        .onItem().invoke(project -> {
          if (!user.equals(project.user)) {
            throw new UnauthorizedException("You are not allowed to update this project");
          }
        }));
  }

  public Uni<List<Project>> listForUser() {
    return userService.getCurrentUser()
      .chain(user -> Project.find("user", user).list());
  }

  @ReactiveTransactional
  public Uni<Project> create(Project project) {
    return userService.getCurrentUser()
      .chain(user -> {
        project.user = user;
        return project.persistAndFlush();
      });
  }

  @ReactiveTransactional
  public Uni<Project> update(Project project) {
    return findById(project.id)
      .chain(p -> Project.getSession())
      .chain(s -> s.merge(project));
  }

  @ReactiveTransactional
  public Uni<Void> delete(long id) {
    return findById(id)
      .chain(p -> Task.update("project = null where project = ?1", p)
        .chain(i -> p.delete()));
  }
}
