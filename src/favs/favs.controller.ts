import {
  Controller,
  Get,
  Param,
  Post,
  Delete,
  HttpException,
  HttpCode,
  Res,
  Req,
  HttpStatus,
} from '@nestjs/common';
import { Response, Request } from 'express';
import { FavService } from './favor.service';
import { accessCheck } from 'src/common/access';

@Controller('favs')
export class FavsController {
  constructor(private favService: FavService) {}
  @Get()
  async getAllFavs(
    @Res() res: Response,
    @Req() request: Request,
  ): Promise<string> {
    const auth = accessCheck(request.headers.authorization);
    if (auth.code === 401) {
      throw new HttpException('Not Authorized', auth.code);
    }
    res.status(HttpStatus.OK).send(await this.favService.getAllFavs());
    return '';
  }
  @Post('track/:id')
  async addTrack(
    @Param('id') id: string,
    @Res() res: Response,
    @Req() request: Request,
  ) {
    const auth = accessCheck(request.headers.authorization);
    if (auth.code === 401) {
      throw new HttpException('Not Authorized', auth.code);
    }
    const result = await this.favService.addTrack(id);
    if (result.code === 400)
      throw new HttpException('Data missing', result.code);
    if (result.code === 422)
      throw new HttpException('Track no exist', result.code);
    res.status(HttpStatus.CREATED).send(result.data);
  }
  @Post('album/:id')
  async addAlbum(
    @Param('id') id: string,
    @Res() res: Response,
    @Req() request: Request,
  ) {
    const auth = accessCheck(request.headers.authorization);
    if (auth.code === 401) {
      throw new HttpException('Not Authorized', auth.code);
    }
    const result = await this.favService.addAlbum(id);
    if (result.code === 400)
      throw new HttpException('Data missing', result.code);
    if (result.code === 422)
      throw new HttpException('Track no exist', result.code);
    res.status(HttpStatus.CREATED).send(result.data);
  }
  @Post('artist/:id')
  async addArtist(
    @Param('id') id: string,
    @Res() res: Response,
    @Req() request: Request,
  ) {
    const auth = accessCheck(request.headers.authorization);
    if (auth.code === 401) {
      throw new HttpException('Not Authorized', auth.code);
    }
    const result = await this.favService.addArtist(id);
    if (result.code === 400)
      throw new HttpException('Data missing', result.code);
    if (result.code === 422)
      throw new HttpException('Track no exist', result.code);
    res.status(HttpStatus.CREATED).send(result.data);
  }

  @Delete('track/:id')
  @HttpCode(204)
  async removeTrack(@Param('id') id: string, @Req() request: Request) {
    const auth = accessCheck(request.headers.authorization);
    if (auth.code === 401) {
      throw new HttpException('Not Authorized', auth.code);
    }
    const result = await this.favService.removeTrack(id);
    if (result.code !== 204)
      throw new HttpException(result.message, result.code);
  }

  @Delete('album/:id')
  @HttpCode(204)
  async removeAlbum(@Param('id') id: string, @Req() request: Request) {
    const auth = accessCheck(request.headers.authorization);
    if (auth.code === 401) {
      throw new HttpException('Not Authorized', auth.code);
    }
    const result = await this.favService.removeAlbum(id);
    if (result.code !== 204)
      throw new HttpException(result.message, result.code);
  }

  @Delete('artist/:id')
  @HttpCode(204)
  async removeArtist(@Param('id') id: string, @Req() request: Request) {
    const auth = accessCheck(request.headers.authorization);
    if (auth.code === 401) {
      throw new HttpException('Not Authorized', auth.code);
    }
    const result = await this.favService.removeArtist(id);
    if (result.code !== 204)
      throw new HttpException(result.message, result.code);
  }
}
