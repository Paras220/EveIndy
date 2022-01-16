from django.conf import settings
from django.contrib.auth.base_user import AbstractBaseUser
from django.db import models


class Invcategories(models.Model):
    categoryid = models.IntegerField(db_column='categoryID', primary_key=True)  # Field name made lowercase.
    categoryname = models.CharField(db_column='categoryName', max_length=100, blank=True,
                                    null=True)  # Field name made lowercase.
    iconid = models.IntegerField(db_column='iconID', blank=True, null=True)  # Field name made lowercase.
    published = models.IntegerField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'invcategories'

    def __str__(self):
        return f"{self.categoryname}"


class Invgroups(models.Model):
    groupid = models.IntegerField(primary_key=True, db_column='groupID')  # Field name made lowercase.
    categoryid = models.ForeignKey(Invcategories, db_column='categoryID', on_delete=models.DO_NOTHING,
                                   related_name="cat")  # Field name made lowercase.
    groupname = models.CharField(db_column='groupName', max_length=100, blank=True,
                                 null=True)  # Field name made lowercase.

    class Meta:
        managed = False
        db_table = 'invgroups'

    def __str__(self):
        return f"{self.categoryid}"


class Invtypes(models.Model):
    typeid = models.IntegerField(db_column='typeID', primary_key=True)  # Field name made lowercase.
    groupid = models.ForeignKey(Invgroups, db_column='groupID', on_delete=models.DO_NOTHING,
                                related_name="group")  # Field name made lowercase.
    typename = models.CharField(db_column='typeName', max_length=100, blank=True,
                                null=True)  # Field name made lowercase.
    description = models.TextField(blank=True, null=True)
    mass = models.FloatField(blank=True, null=True)
    volume = models.FloatField(blank=True, null=True)
    capacity = models.FloatField(blank=True, null=True)
    portionsize = models.IntegerField(db_column='portionSize', blank=True, null=True)  # Field name made lowercase.
    raceid = models.IntegerField(db_column='raceID', blank=True, null=True)  # Field name made lowercase.
    baseprice = models.DecimalField(db_column='basePrice', max_digits=19, decimal_places=4, blank=True,
                                    null=True)  # Field name made lowercase.
    published = models.IntegerField(blank=True, null=True)
    marketgroupid = models.IntegerField(db_column='marketGroupID', blank=True, null=True)  # Field name made lowercase.
    iconid = models.IntegerField(db_column='iconID', blank=True, null=True)  # Field name made lowercase.
    soundid = models.IntegerField(db_column='soundID', blank=True, null=True)  # Field name made lowercase.
    graphicid = models.IntegerField(db_column='graphicID', blank=True, null=True)  # Field name made lowercase.

    class Meta:
        managed = False
        db_table = 'invtypes'

    def __str__(self):
        return f"{self.typename} {self.typeid} {self.groupid}"
        # return f"{self.typename}"


# Create your models here.
class User(AbstractBaseUser):
    character_name = models.CharField(max_length=200, default="")
    character_id = models.CharField(max_length=150, unique=True)
    owner_hash = models.CharField(max_length=200)
    is_updated = models.BooleanField(default=True)
    password = None

    USERNAME_FIELD = 'character_id'

    def __str__(self):
        return self.character_id


class Selections(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='selections')
    blueprint = models.ForeignKey(Invtypes, on_delete=models.CASCADE)
    me = models.IntegerField()
    te = models.IntegerField()
    runs = models.IntegerField()
    copies = models.IntegerField()

    def __str__(self):
        return f"{self.blueprint} ME: {self.me} TE: {self.te} RUNS: {self.runs} COPIES: {self.copies}"

    class Meta:
        constraints = [
            models.UniqueConstraint(fields=['user', 'blueprint'], name='unique_selection')
        ]


class Industryactivitymaterials(models.Model):
    id = models.AutoField(primary_key=True)
    typeid = models.ForeignKey(Invtypes, on_delete=models.CASCADE, db_column="typeid", related_name="mats")
    activityid = models.IntegerField(db_column='activityID')  # Field name made lowercase.
    materialtypeid = models.ForeignKey(Invtypes, on_delete=models.CASCADE, db_column='materialTypeID', related_name='+')
    quantity = models.IntegerField()

    class Meta:
        managed = False
        db_table = 'industryactivitymaterials'
        # unique_together = (('typeid', 'activityid', 'materialtypeid'),)

    def __str__(self):
        return f" {self.materialtypeid} {self.quantity}"