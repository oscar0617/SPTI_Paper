package edu.eci.spti.chatroom.configuration;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpStatus;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.provisioning.InMemoryUserDetailsManager;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.HttpStatusEntryPoint;

@Configuration
public class SecurityConfig {

    @Bean
	public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .csrf().disable()
            .authorizeHttpRequests((requests) -> requests
                .requestMatchers("/login").permitAll()
                .requestMatchers("/api/salas/**").permitAll()
                .anyRequest().authenticated()
            )
            .exceptionHandling()
            .authenticationEntryPoint(new HttpStatusEntryPoint(HttpStatus.UNAUTHORIZED))
            .and()
            .formLogin()
                .loginPage("/login")
                .permitAll()
            .and()
            .logout()
                .permitAll();

        return http.build();
    }
    @Bean
    public UserDetailsService userDetailsService() {
        UserDetails user1 = User.withDefaultPasswordEncoder()
                                .username("user1")
                                .password("password1")
                                .roles("USER")
                                .build();

        UserDetails user2 = User.withDefaultPasswordEncoder()
                                .username("user2")
                                .password("password2")
                                .roles("USER")
                                .build();

        return new InMemoryUserDetailsManager(user1, user2);
    }
}
