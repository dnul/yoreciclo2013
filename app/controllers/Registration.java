package controllers;

import java.util.Map;

import models.User;

import org.codehaus.jackson.JsonNode;

import play.libs.Json;
import play.mvc.Controller;
import play.mvc.Result;

public class Registration extends Controller {
	
	public static Result signUp(){
        Map<String, String[]> map = request().body().asFormUrlEncoded();
        User localUser = Application.getLocalUser(session());

        String[] items = map.get("items");
        String direccion = map.get("address")[0];
        
        JsonNode itemsJson = Json.toJson(items);
        
        localUser.address=direccion;
        localUser.recycledItems=itemsJson.toString();
        localUser.save();
        
        return ok("success");
	}

}
