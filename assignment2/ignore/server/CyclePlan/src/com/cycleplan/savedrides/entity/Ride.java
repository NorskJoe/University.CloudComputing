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
	String user_mail;
	@Persistent
	String start_lat;
	@Persistent
	String start_lng;
	@Persistent
	String end_lat;
	@Persistent
	String end_lng;
	
	public Long getRecordId() {
		return record_id;
	}
	
	public void setRecordId(Long n) {
		this.record_id = n;
	}
	
	public String getUserId() {
		return user_mail;
	}
	
	public void setUserId(String mail) {
		this.user_mail = mail;
	}
	
	public String getStartLat() {
		return start_lat;
	}
	
	public void setStartLat(String n) {
		this.start_lat = n;
	}
	
	public String getStartLng() {
		return start_lng;
	}
	
	public void setStartLng(String n) {
		this.start_lng = n;
	}
	
	public String getEndLat() {
		return end_lat;
	}
	
	public void setEndLat(String n) {
		this.end_lat = n;
	}
	
	public String getEndLng() {
		return this.end_lng;
	}
	
	public void setEndLng(String n) {
		this.end_lng = n;
	}

}
