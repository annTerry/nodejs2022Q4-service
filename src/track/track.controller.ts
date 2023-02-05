import {
  Controller,
  Get,
  Param,
  Post,
  Put,
  Delete,
  Body,
  HttpException,
  HttpCode,
} from '@nestjs/common';
import { TrackService } from './track.service';
import { Track } from 'src/common/types';

@Controller('track')
export class TrackController {
  trackService = new TrackService();

  @Get()
  getAllTracks(): string {
    return JSON.stringify(this.trackService.getAllTracks());
  }
  @Get(':id')
  getUserById(@Param('id') id: string): string {
    const dbResponse = this.trackService.getTrack(id);
    if (!dbResponse.data) {
      throw new HttpException(dbResponse.message, dbResponse.code);
    }
    return JSON.stringify(dbResponse.data);
  }
  @Post()
  async create(@Body() track: Track) {
    const result = this.trackService.create(track);
    if (result === 400) throw new HttpException('Data missing', result);
  }
  @Put(':id')
  async edit(@Param('id') id: string, @Body() track: Track) {
    const result = this.trackService.changeTrack(id, track);
    if (result.code !== 200)
      throw new HttpException(result.message, result.code);
  }
  @Delete(':id')
  @HttpCode(204)
  delUserById(@Param('id') id: string) {
    const result = this.trackService.removeTrack(id);
    if (result.code !== 200)
      throw new HttpException(result.message, result.code);
  }
}
