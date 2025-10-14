package org.bisag.jktourism.payload.response;

import org.bisag.jktourism.utils.Json;

public class MessageResponse {
	private String message;

	public MessageResponse(String message) throws Exception {
	    this.message = Json.serialize(message);
	  }

	public String getMessage() {
		return message;
	}

	public void setMessage(String message) {
		this.message = message;
	}
}
