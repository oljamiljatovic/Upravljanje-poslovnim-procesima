package upp.upp;

import java.util.Comparator;

import upp.upp.offer.Offer;

public class OfferComparator implements Comparator<Offer> {
    @Override
    public int compare(Offer o1, Offer o2) {
        return o1.getTimeLimit().compareTo(o2.getTimeLimit());
    }
}