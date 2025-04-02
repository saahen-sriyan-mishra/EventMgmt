package com.pxp.SQLite.demo.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.pxp.SQLite.demo.entity.Booked;

@Repository
public interface BookedRepository extends JpaRepository<Booked, Integer> {
    // Custom queries can be added here if needed
}