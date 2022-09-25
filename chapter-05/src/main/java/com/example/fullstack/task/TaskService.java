package com.example.fullstack.task;

import com.example.fullstack.user.UserService;
import io.quarkus.hibernate.reactive.panache.common.runtime.ReactiveTransactional;
import io.quarkus.security.UnauthorizedException;
import io.smallrye.mutiny.Uni;
import org.hibernate.ObjectNotFoundException;

import javax.enterprise.context.ApplicationScoped;
import javax.inject.Inject;
import java.time.ZonedDateTime;
import java.util.List;

@ApplicationScoped
public class TaskService {

  private final UserService userService;

  @Inject
  public TaskService(UserService userService) {
    this.userService = userService;
  }

  public Uni<Task> findById(long id) {
    return userService.getCurrentUser()
      .chain(user -> Task.<Task>findById(id)
        .onItem().ifNull().failWith(() -> new ObjectNotFoundException(id, "Task"))
        .onItem().invoke(task -> {
          if (!user.equals(task.user)) {
            throw new UnauthorizedException("You are not allowed to update this task");
          }
        }));
  }

  public Uni<List<Task>> listForUser() {
    return userService.getCurrentUser()
      .chain(user -> Task.find("user", user).list());
  }

  @ReactiveTransactional
  public Uni<Task> create(Task task) {
    return userService.getCurrentUser()
      .chain(user -> {
        task.user = user;
        return task.persistAndFlush();
      });
  }

  @ReactiveTransactional
  public Uni<Task> update(Task task) {
    return findById(task.id)
      .chain(t -> Task.getSession())
      .chain(s -> s.merge(task));
  }

  @ReactiveTransactional
  public Uni<Void> delete(long id) {
    return findById(id)
      .chain(Task::delete);
  }

  @ReactiveTransactional
  public Uni<Boolean> setComplete(long id, boolean complete) {
    return findById(id)
      .chain(task -> {
        task.complete = complete ? ZonedDateTime.now() : null;
        return task.persistAndFlush();
      })
      .chain(task -> Uni.createFrom().item(complete));
  }
}
