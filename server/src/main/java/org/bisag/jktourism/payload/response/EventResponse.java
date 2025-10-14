package org.bisag.jktourism.payload.response;

import java.util.Date;

public class EventResponse {

    private Long id;
    private String title;
    private String image;
    private Date startDate;

    public EventResponse(Long id, String title, String image, Date startDate) {
        this.id = id;
        this.title = title;
        this.image = image;
        this.startDate = startDate;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getImage() {
        return image;
    }

    public void setImage(String image) {
        this.image = image;
    }

    public Date getStartDate() {
        return startDate;
    }

    public void setStartDate(Date startDate) {
        this.startDate = startDate;
    }
}
