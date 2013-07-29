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
        String[] coopIds= map.get("coopIds[]");
        String  address = map.get("addressText")!=null?map.get("addressText")[0]:null;
        
        Logger.info(items[0]);
        Logger.info(coords[0]);
        Logger.info(coords[1]);
        Logger.info(coopIds[0]);
        
        JsonNode itemsJson = Json.toJson(items);
        JsonNode coopsJson = Json.toJson(coopIds);
        
        localUser.lat=coords[0];
        localUser.lon=coords[1];
        localUser.coopIds= coopsJson.toString();
        
        localUser.address=address;
        localUser.recycledItems=itemsJson.toString();
        localUser.hasRegistered=true;
        Logger.info(localUser.recycledItems);
        localUser.save();
        
        return ok();
	}

}
