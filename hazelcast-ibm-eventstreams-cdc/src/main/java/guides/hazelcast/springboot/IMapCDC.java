package guides.hazelcast.springboot;

import com.hazelcast.core.EntryEvent;
import com.hazelcast.map.MapEvent;
import com.hazelcast.map.listener.*;

public class IMapCDC implements
        EntryAddedListener<String, String>,
        EntryRemovedListener<String, String>,
        EntryUpdatedListener<String, String>,
        EntryEvictedListener<String, String>,
        EntryLoadedListener<String,String>,
        MapEvictedListener,
        MapClearedListener {

    private EventStreamProducer producerService;

    IMapCDC() {
        producerService = new EventStreamProducer();
    }

    @Override
    public void entryAdded( EntryEvent<String, String> event ) {
        System.out.println( "Entry Added:" + jsonValue(event) );
        producerService.sendMessage(event.getKey().toString(), jsonValue(event));
    }

    @Override
    public void entryRemoved( EntryEvent<String, String> event ) {
        System.out.println( "Entry Removed:" + jsonValue(event) );
        producerService.sendMessage(event.getKey().toString(), jsonValue(event));
    }

    @Override
    public void entryUpdated( EntryEvent<String, String> event ) {
        System.out.println( "Entry Updated:" + jsonValue(event)  );
        producerService.sendMessage(event.getKey().toString(), jsonValue(event));
    }

    @Override
    public void entryEvicted( EntryEvent<String, String> event ) {
        System.out.println( "Entry Evicted:" + jsonValue(event) );
    }

    @Override
    public void entryLoaded( EntryEvent<String, String> event ) {
        System.out.println( "Entry Loaded:" + jsonValue(event) );
    }

    @Override
    public void mapEvicted( MapEvent event ) {
        System.out.println( "Map Evicted:" + event );
    }

    @Override
    public void mapCleared( MapEvent event ) {
        System.out.println( "Map Cleared:" + event );
    }

    private String jsonValue(EntryEvent event) {
        return "{ \"value\": " +
                    "{" +
                        "\"key\": \"" + event.getKey() + "\"," +
                        "\"value\": \"" + event.getValue() + "\"," +
                        "\"oldValue\": \"" + event.getOldValue() + "\"," +
                        "\"mergeValue\": \"" + event.getMergingValue() + "\"" +
                    "}" +
                " }";
    }
}
