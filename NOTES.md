# NOTES

- https://ergast.com/api/f1/2010/drivers.json
- https://ergast.com/api/f1/2010/results.json?limit=1000

~~~console
http --body "https://ergast.com/api/f1/2010/results.json?limit=1000" | jq -c "[.MRData.RaceTable.Races[] as \$race | \$race.Results[] | { round: \$race.round, race: \$race.raceName, position: .position, points: .points, driver: .Driver.driverId, lastName: .Driver.familyName, firstName: .Driver.givenName }]" > results-2010.json
~~~
