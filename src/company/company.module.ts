import { Module } from '@nestjs/common';
import { CompanyService } from './company.service';

@Module({
  //imports: [TypeOrmModule.forRoot(config), TypeOrmModule.forFeature([Jobcard])],
  providers: [CompanyService],
  exports: [CompanyService],
})
export class CompanyModule {}
