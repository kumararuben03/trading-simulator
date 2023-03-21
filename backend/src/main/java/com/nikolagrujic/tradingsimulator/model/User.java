package com.nikolagrujic.tradingsimulator.model;

import lombok.Getter;
import lombok.Setter;
import javax.persistence.*;
import javax.validation.constraints.*;

@Getter
@Setter
@Entity
@Table
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    @NotBlank(message = "First name must not be empty!")
    private String firstName;

    @NotNull
    @NotBlank(message = "Last name must not be empty!")
    private String lastName;

    @Column(unique = true)
    @NotNull
    @NotBlank(message = "The email must not be empty!")
    @Email(message = "Wrong email format.")
    private String email;

    @NotNull
    @NotEmpty(message = "The password must not be empty!")
    @Size(min = 8, message = "The password length must consist of at least 8 characters.")
    private String password;

    @Column(columnDefinition = "boolean default false")
    private boolean emailVerified;

    @OneToOne(mappedBy = "user", cascade = CascadeType.REMOVE)
    private EmailVerificationToken emailVerificationToken;
}
