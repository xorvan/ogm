import Promise from 'bluebird';
import Person from './spec.models/Person';
import Territory from './spec.models/Territory';
import IsPartOf from './spec.models/IsPartOf';


describe("Vertex", function () {
  before(async function () {
    await CREATE_TEST_DB(this, 'testdb_Vertex').bind(this);

    await Promise.map([
      'CREATE CLASS Person EXTENDS V',
      'CREATE CLASS Territory EXTENDS V',

      'CREATE CLASS IsPartOf EXTENDS E',
      'CREATE PROPERTY IsPartOf.in LINK Territory',
      'CREATE PROPERTY IsPartOf.out LINK Territory',
      'ALTER PROPERTY IsPartOf.out MANDATORY=true',
      'ALTER PROPERTY IsPartOf.in MANDATORY=true',

      'INSERT INTO Territory SET name = "Frisia"',
      'INSERT INTO Territory SET name = "Lotharingia"',
      'INSERT INTO Territory SET name = "Bavaria"',
      'INSERT INTO Territory SET name = "Germany"',

      'INSERT INTO Territory SET name = "Holy Roman Empire"',

      'CREATE EDGE IsPartOf FROM (SELECT FROM Territory WHERE name = "Frisia") TO (SELECT FROM Territory WHERE name="Holy Roman Empire")',
      'CREATE EDGE IsPartOf FROM (SELECT FROM Territory WHERE name = "Lotharingia") TO (SELECT FROM Territory WHERE name="Holy Roman Empire")',
      'CREATE EDGE IsPartOf FROM (SELECT FROM Territory WHERE name = "Bavaria") TO (SELECT FROM Territory WHERE name="Holy Roman Empire")',
      'CREATE EDGE IsPartOf FROM (SELECT FROM Territory WHERE name = "Germany") TO (SELECT FROM Territory WHERE name="Holy Roman Empire")'
    ], this.db.query.bind(this.db));

    // await Person.sync()
  });
  after(async function () {
    await DELETE_TEST_DB('testdb_Vertex');
  });

  var newRid, t1;

  it('should be able to save an new instance', async function () {
    var p1 = new Person({name: "Gholi"});

    expect(p1.name).to.eql("Gholi");

    await p1.save();

    expect(p1).to.have.property('@rid');

    newRid = p1['@rid'];

    var result = await Person.query().all();

    expect(result).to.have.length(1);

    expect(result[0]).to.be.an.instanceof(Person);
    expect(result[0].name).to.eql("Gholi");
    expect(result[0].name).to.eql("Gholi");

  });

  it('should be able to query and update an instance', async function () {
    var p1 = await Person.query({name: 'Gholi'}).one();

    expect(p1).to.be.an.instanceof(Person);
    expect(p1.name).to.eql("Gholi");

    var rid = p1['@rid'];

    p1.name = 'Taghi';

    await p1.save();

    expect(p1['@rid']).to.eql(rid);
    expect(p1.name).to.eql('Taghi');

    var result = await Person.query().all();

    expect(result).to.have.length(1);

    expect(result[0].name).to.eql("Taghi");

  });

  it('should be able to get and delete an instance', async function () {
    var p1 = await Person.get(newRid);

    expect(p1).to.be.an.instanceof(Person);
    expect(p1.name).to.eql("Taghi");

    await p1.delete();

    var result = await Person.query().all();

    expect(result).to.have.length(0);

  });

  it('should be able to get all vertexes have link with specific edge', async function () {
    var p1 = await Territory.query({'name': 'Holy Roman Empire'}).one();

    expect(p1).to.be.an.instanceof(Territory);
    expect(p1.name).to.eql('Holy Roman Empire');

    var subTerritories = await p1.inV(IsPartOf).all();
    
    expect(subTerritories).to.have.length(4);
    t1 = subTerritories[0];
    expect(subTerritories[0]).to.be.an.instanceof(Territory);

    expect(subTerritories.map(t => t.name)).to.have.members(['Frisia', 'Lotharingia', 'Germany', 'Bavaria']);

  });

  it('should be able to delete an instance by rid', async function () {
    
    await Territory.delete(t1['@rid']);

    var result = await Territory.query().all();

    expect(result).to.have.length(4);

  });


});