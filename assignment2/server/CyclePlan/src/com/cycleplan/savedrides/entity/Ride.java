package com.cycleplan.savedrides.entity;

import javax.jdo.annotations.IdGeneratorStrategy;
import javax.jdo.annotations.IdentityType;
import javax.jdo.annotations.PersistenceCapable;
import javax.jdo.annotations.Persistent;
import javax.jdo.annotations.PrimaryKey;

@PersistenceCapable(identityType = IdentityType.APPLICATION)
public class Ride {
	@PrimaryKey
	@Persistent(valueStrategy = IdGeneratorStrategy.IDENTITY)
	Long record_id;
	@Persistent
	Long user_id;
	@Persistent
	Long start_lat;
	@Persistent
	Long start_lng;
	@Persistent
	Long end_lat;
	@Persistent
	Long end_lng;
	
	public Long getRecordId() {
		return record_id;
	}
	
	public void setRecordId(Long n) {
		this.record_id = n;
	}
	
	public Long getUserId() {
		return user_id;
	}
	
	public void setUserId(Long id) {
		this.user_id = id;
	}
	
	public Long getStartLat() {
		return start_lat;
	}
	
	public void setStartLat(Long n) {
		this.start_lat = n;
	}
	
	public Long getStartLng() {
		return start_lng;
	}
	
	public void setStartLng(Long n) {
		this.start_lng = n;
	}
	
	public Long getEndLat() {
		return end_lat;
	}
	
	public void setEndLat(Long n) {
		this.end_lat = n;
	}
	
	public Long getEndLng() {
		return this.end_lng;
	}
	
	public void setEndLng(Long n) {
		this.end_lng = n;
	}

}
