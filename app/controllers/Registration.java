package controllers;

import java.util.Map;

import models.User;

import org.codehaus.jackson.JsonNode;

import play.Logger;
import play.libs.Json;
import play.mvc.Controller;
import play.mvc.Result;

public class Registration extends Controller {
	
	public static Result signUp(){
		Logger.info("registering");
        Map<String, String[]> map = request().body().asFormUrlEncoded();
        User localUser = Application.getLocalUser(session());

        String[] items = map.get("items[]");
        String direccion = map.get("address")[0];
        
        Logger.info(items.toString());
        Logger.info(direccion.toString());
        
        JsonNode itemsJson = Json.toJson(items);
        
        localUser.address=direccion;
        localUser.recycledItems=itemsJson.toString();
        localUser.hasRegistered=true;
        Logger.info(localUser.recycledItems);
        localUser.save();
        
        return ok("success");
	}

}
