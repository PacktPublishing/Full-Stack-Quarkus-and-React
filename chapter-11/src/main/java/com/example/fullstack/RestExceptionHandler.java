package com.example.fullstack;

import io.vertx.pgclient.PgException;
import org.hibernate.HibernateException;
import org.hibernate.ObjectNotFoundException;
import org.hibernate.StaleObjectStateException;

import javax.ws.rs.core.Response;
import javax.ws.rs.ext.ExceptionMapper;
import javax.ws.rs.ext.Provider;
import java.util.Objects;
import java.util.Optional;

@Provider
public class RestExceptionHandler implements ExceptionMapper<HibernateException> {

  private static final String PG_UNIQUE_VIOLATION_ERROR = "23505";

  @Override
  public Response toResponse(HibernateException exception) {
    if (hasExceptionInChain(exception, ObjectNotFoundException.class)) {
      return Response.status(Response.Status.NOT_FOUND).entity(exception.getMessage()).build();
    }
    if (hasExceptionInChain(exception, StaleObjectStateException.class)
      || hasPostgresErrorCode(exception, PG_UNIQUE_VIOLATION_ERROR)) {
      return Response.status(Response.Status.CONFLICT).build();
    }
    return Response
      .status(Response.Status.BAD_REQUEST)
      .entity("\"" + exception.getMessage() + "\"")
      .build();
  }

  private static boolean hasExceptionInChain(Throwable throwable, Class<? extends Throwable> exceptionClass) {
    return getExceptionInChain(throwable, exceptionClass).isPresent();
  }

  private static boolean hasPostgresErrorCode(Throwable throwable, String code) {
    return getExceptionInChain(throwable, PgException.class)
      .filter(ex -> Objects.equals(ex.getCode(), code))
      .isPresent();
  }

  private static <T extends Throwable> Optional<T> getExceptionInChain(Throwable throwable, Class<T> exceptionClass) {
    while (throwable != null) {
      if (exceptionClass.isInstance(throwable)) {
        return Optional.of((T) throwable);
      }
      throwable = throwable.getCause();
    }
    return Optional.empty();
  }
}

