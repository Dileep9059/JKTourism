package org.bisag.jktourism.repository;

import java.util.List;

import org.bisag.jktourism.models.ApiHit;
import org.bisag.jktourism.record.ActivityStat;
import org.bisag.jktourism.record.CategoryStat;
import org.bisag.jktourism.record.ExperienceStat;
import org.bisag.jktourism.record.ShoppingStat;
import org.bisag.jktourism.record.SubCategoryStat;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface ApiHitRepository extends JpaRepository<ApiHit, Long> {
        @Query("SELECT new org.bisag.jktourism.record.CategoryStat(a.category, COUNT(a)) " +
                        "FROM ApiHit a " +
                        "WHERE a.type = 'category' AND a.category IS NOT NULL " +
                        "GROUP BY a.category")
        List<CategoryStat> getCategoryStats();

        @Query("SELECT new org.bisag.jktourism.record.SubCategoryStat(a.category, a.subCategory, COUNT(a)) " +
                        "FROM ApiHit a " +
                        "WHERE a.type = 'category' AND a.subCategory IS NOT NULL " +
                        "GROUP BY a.category, a.subCategory")
        List<SubCategoryStat> getSubCategoryStats();

        @Query("SELECT a.subCategory AS experience, COUNT(a) AS hits " +
                        "FROM ApiHit a " +
                        "WHERE a.type = 'experience' AND a.subCategory IS NOT NULL " +
                        "GROUP BY a.subCategory")
        List<ExperienceStat> getExperienceStats();

        @Query("SELECT a.subCategory AS activity, COUNT(a) AS hits " +
                        "FROM ApiHit a " +
                        "WHERE a.type = 'activities' AND a.subCategory IS NOT NULL " +
                        "GROUP BY a.subCategory")
        List<ActivityStat> getActivityStats();
        
        @Query("SELECT a.subCategory AS shopping, COUNT(a) AS hits " +
                        "FROM ApiHit a " +
                        "WHERE a.type = 'shopping' AND a.subCategory IS NOT NULL " +
                        "GROUP BY a.subCategory")
        List<ShoppingStat> getShoppingStats();

}
