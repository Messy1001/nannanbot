import json
import re

def main(squery, gsys=None, gfes=None):
    with open('cardlist.json') as cardlist:
        values = json.load(cardlist)

    card = []
    query = squery.lower()
    ctype = None
    rarity = None
    digit = None

    gacha = re.search( r'ga(c|s)ha',query, re.M|re.I)
    if gacha:
        ctype = "Gacha"
        query = re.sub( r'( )?ga(c|s)ha( )?', '', query, re.M|re.I)
    perm = re.search( r'()?perm(a(nent)?)?',query, re.M|re.I)
    if perm:
        ctype = "Permanent"
        query = re.sub( r'( )?perm(a(nent)?)?( )?', '', query, re.M|re.I)
    lim = re.search( r'lim(ited)?',query, re.M|re.I)
    if lim:
        ctype = "Limited"
        query = re.sub( r'( )?lim(ited)?( )?', '', query, re.M|re.I)
    fes = re.search( r'(mil(l)?i)?fes(t)?',query, re.M|re.I)
    if fes:
        ctype = "Millifes"
        query = re.sub( r'( )?(mil(l)?i)?fes(t)?( )?', '', query, re.M|re.I)
    event = re.search( r'event',query, re.M|re.I)
    if event:
        ctype = "Event"
        query = re.sub( r'( )?event( )?', '', query, re.M|re.I)
    pst = re.search( r'pst(heater|our)?',query, re.M|re.I)
    if pst:
        ctype = "Event (PST)"
        query = re.sub( r'( )?pst(heater|our)?( )?', '', query, re.M|re.I)
    colle = re.search( r'(mil(l)?i)?colle',query, re.M|re.I)
    if colle:
        ctype = "Event (MilliColle)"
        query = re.sub( r'(( )?mil(l)?i)?colle( )?', '', query, re.M|re.I)

    ssr = re.search( r'\bssr',query, re.M|re.I)
    if ssr:
        rarity = "SSR"
        query = re.sub( r'( )?\bssr( )?', '', query, re.M|re.I)
    sr = re.search( r'\bsr',query, re.M|re.I)
    if sr:
        rarity = "SR"
        query = re.sub( r'( )?\bsr( )?', '', query, re.M|re.I)
    r = re.search( r'\br\b',query, re.M|re.I)
    if r:
        rarity = "R"
        query = re.sub( r'( )?\br\b( )?', '', query, re.M|re.I)

    digit = re.search( r'\d', query, re.M|re.I)
    if digit:
        digit = digit.group()
        query = re.sub( r'( )?\d( )?', '', query, re.M|re.I)

    if not values:
        rip = 'No data found.'
        return rip
    else:
        values = sorted(values, key=lambda tup: tup['Release Date'], reverse=True)
        values = sorted(values, key=lambda tup: tup['Rarity'], reverse=True)
        if gsys is None:
            for row in values:
                if query.lower() == row["Name"].lower():
                    card.append(row)
                else:
                    row["Name"] = row["Name"].split(' ', 1)
                    if len(row["Name"]) > 1:
                        if query.lower() == row["Name"][0].lower():
                            card.append(row)
                        elif query.lower() == row["Name"][1].lower():
                            card.append(row)
                        row["Name"] = row["Name"][0] + " " + row["Name"][1]
                    else:
                        row["Name"] = row["Name"][0]

            if ctype:
                cftype = []
                for row in card:
                    if row["Availability"] == ctype:
                        cftype.append(row)
                    elif ctype == "Gacha":
                        if row["Availability"] == "Permanent" or row["Availability"] == "Limited" or row["Availability"] == "Millifes":
                            cftype.append(row)
                    elif ctype == "Event":
                        if row["Availability"] == "Event (PST)" or row["Availability"] == "Event (PS Tour)" or row["Availability"] == "Event (MilliColle)":
                             cftype.append(row)
                    if ctype == "Event (PST)":
                        if row["Availability"] == "Event (PS Tour)":
                            cftype.append(row)
                card = cftype
            if rarity:
                cfrarity = []
                for row in card:
                    if row["Rarity"] == rarity:
                        cfrarity.append(row)
                card = cfrarity
            if digit:
                try:
                    digit = int(digit)
                    cfdigit = []
                    cfdigit.append(card[digit-1])
                    card = cfdigit
                except:
                    rip = 'No data found.'
                    return rip
            else:
                if card == []:
                    rip = 'No data found.'
                    return rip
        else:
            if gfes:
                for row in values:
                    if row["Availability"] == "Permanent" or row["Availability"] == "Millifes":
                        card.append(row)
            else:
                for row in values:
                    if row["Availability"] == "Permanent" or row["Availability"] == "Limited":
                        card.append(row)

        return card

if __name__ == '__main__':
    main()
