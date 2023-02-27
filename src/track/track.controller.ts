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
  Res,
  Req,
  HttpStatus,
} from '@nestjs/common';
import { Response, Request } from 'express';
import { TrackService } from './track.service';
import { Track } from 'src/common/types';
import { accessCheck } from 'src/common/access';

@Controller('track')
export class TrackController {
  constructor(private trackService: TrackService) {}

  @Get()
  async getAllTracks(
    @Res() res: Response,
    @Req() request: Request,
  ): Promise<string> {
    const auth = accessCheck(request.headers.authorization);
    if (auth.code === 401) {
      throw new HttpException('Not Authorized', auth.code);
    }
    res.status(HttpStatus.OK).send(await this.trackService.getAllTracks());
    return '';
  }
  @Get(':id')
  async getTrackById(
    @Param('id') id: string,
    @Res() res: Response,
    @Req() request: Request,
  ): Promise<string> {
    const auth = accessCheck(request.headers.authorization);
    if (auth.code === 401) {
      throw new HttpException('Not Authorized', auth.code);
    }
    const dbResponse = await this.trackService.getTrack(id);
    const dataRS = dbResponse.data as Track;
    if (!dataRS || !dataRS.id) {
      throw new HttpException(dbResponse.message, dbResponse.code);
    }
    res.status(HttpStatus.OK).send(dbResponse.data);
    return '';
  }
  @Post()
  async create(
    @Body() track: Track,
    @Res() res: Response,
    @Req() request: Request,
  ) {
    const auth = accessCheck(request.headers.authorization);
    if (auth.code === 401) {
      throw new HttpException('Not Authorized', auth.code);
    }
    const result = await this.trackService.create(track);
    if (result.code === 400)
      throw new HttpException('Data missing', result.code);
    res.status(HttpStatus.CREATED).send(result.data);
  }
  @Put(':id')
  async edit(
    @Param('id') id: string,
    @Body() track: Track,
    @Res() res: Response,
    @Req() request: Request,
  ) {
    const auth = accessCheck(request.headers.authorization);
    if (auth.code === 401) {
      throw new HttpException('Not Authorized', auth.code);
    }
    const result = await this.trackService.changeTrack(id, track);
    if (result.code !== 200)
      throw new HttpException(result.message, result.code);
    res.status(HttpStatus.OK).send(result.data);
  }
  @Delete(':id')
  @HttpCode(204)
  async delUserById(@Param('id') id: string, @Req() request: Request) {
    const auth = accessCheck(request.headers.authorization);
    if (auth.code === 401) {
      throw new HttpException('Not Authorized', auth.code);
    }
    const result = await this.trackService.removeTrack(id);
    if (result.code !== 200)
      throw new HttpException(result.message, result.code);
  }
}
