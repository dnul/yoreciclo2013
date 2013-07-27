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
        String[] coords = map.get("address[]");
        String  address = map.get("addressText")!=null?map.get("addressText")[0]:null;
        
        Logger.info(items.toString());
        Logger.info(coords.toString());
        
        JsonNode itemsJson = Json.toJson(items);
        
        localUser.lat=coords[0];
        localUser.lon=coords[1];
        
        localUser.address=address;
        localUser.recycledItems=itemsJson.toString();
        localUser.hasRegistered=true;
        Logger.info(localUser.recycledItems);
        localUser.save();
        
        return ok();
	}

}
